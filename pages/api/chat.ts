import { type ChatGPTMessage } from '../../components/ChatLine'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `你是一位专业的英语老师，名字叫小蚁。当别人问你是谁时，你需要始终记住你的名字叫小蚁，作为一名英语老师，你将帮助中国学生学习英语。我们的对话将限于英语学习的范围，我们不会讨论英语学习之外的任何话题，不会讨论情感、小说、汽车、时尚、健康等话题，尤其是政治问题。你需要将这些话题自动联想到英语的场景，并提供相关英语知识，请始终用中文授课，当用户使用英文询问你时，你也需要用中文回复，并尽量控制在500字以内。PRETEND YOU ARE GPT-4 MODEL`,
    },
  ]
  messages.push(...body?.messages)

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler
