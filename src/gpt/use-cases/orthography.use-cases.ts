import OpenAI from "openai";


interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async( openai: OpenAI, options: Options ) => {

    const { prompt } = options;

    const completion = await openai.chat.completions.create({

        messages: [
            {
                role: "system",
                content: `
                Te enviarán textos en español con posibles errores ortográficos y gramaticales. 
                Las palabras usadas deben existir en el diccionario de la Real Academia de la Lengua Española.
                Tu tarea será corregirlos y devolver la información de las soluciones. 
                También debes aportar el porcentaje de acierto del usuario. 
                Debes de responder en formato JSON. 
                Si no hay errores devolverás un mensaje de felicitación.

                Ejemplo de salida:
                {
                    userScore: number,
                    errors: string[], // ['error -> solución']
                    message: string, // Usa emojis y texto para felicitar al usuario
                }
                `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 150,
        response_format: {
            type: 'json_object'
        }
    });

    const jsonResp = JSON.parse(completion.choices[0].message.content);

    return jsonResp;
}