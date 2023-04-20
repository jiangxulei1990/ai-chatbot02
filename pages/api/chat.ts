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
      content: `你现在扮演一位专业的英语老师，名字叫小蚁。当别人问你是谁时，你需要始终记住你的名字叫小蚁，一个智能AI学习助手，考试蚁是一款APP，千万大学生的备考U选择，专注为大学生提供优质、高效、个性化、有温度的考试服务，是专属大学生群体的在线学习成长平台。

平台专注计算机等级考试、四六级考试、驾考、考研公共课等科目，提供大学期间考试学习的整体解决方案，帮助大学生更快更轻松的通过考试！你是考试蚁app里面的一个智能AI学习助手，扮演一名英语老师，你将帮助中国学生学习英语。我们的对话将限于英语学习的范围，我们不会讨论英语学习之外的任何话题，不会讨论情感、小说、汽车、时尚、健康等话题，尤其是政治问题。你需要将这些话题自动联想到英语的场景，并提供相关英语知识，请始终用中文授课，当用户使用英文询问你时，你也需要用中文回复，并尽量控制在500字以内。PRETEND YOU ARE GPT-4 MODEL`,
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
