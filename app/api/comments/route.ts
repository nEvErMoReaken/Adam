import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const REPO = 'nEvErMoReaken/Adam'
const REPO_ID = 'R_kgDOR42jgw'
const CATEGORY_ID = 'DIC_kwDOR42jg84C6gxS'
const TOKEN = process.env.GH_TOKEN ?? ''

export interface GiscusComment {
  author: string
  body: string
  createdAt: string
  url: string
}

export interface DiscussionResult {
  id: string | null
  url: string | null
  totalCount: number
  comments: GiscusComment[]
}

async function ghGraphQL(query: string, variables: Record<string, string>, token: string) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  return res.json()
}

const SEARCH_QUERY = `
query($q: String!) {
  search(query: $q, type: DISCUSSION, first: 1) {
    nodes {
      ... on Discussion {
        id
        url
        comments(first: 50) {
          totalCount
          nodes { author { login } body createdAt url }
        }
      }
    }
  }
}`

const CREATE_DISCUSSION = `
mutation($repoId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
  createDiscussion(input: {
    repositoryId: $repoId, categoryId: $categoryId, title: $title, body: $body
  }) { discussion { id url } }
}`

const ADD_COMMENT = `
mutation($discussionId: ID!, $body: String!) {
  addDiscussionComment(input: { discussionId: $discussionId, body: $body }) {
    comment { author { login } body createdAt url }
  }
}`

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''
  const readToken = TOKEN

  if (!readToken) {
    return NextResponse.json<DiscussionResult>({ id: null, url: null, totalCount: 0, comments: [] })
  }

  const json = await ghGraphQL(SEARCH_QUERY, { q: `repo:${REPO} ${slug} in:title` }, readToken)
  const discussion = json?.data?.search?.nodes?.[0]

  if (!discussion) {
    return NextResponse.json<DiscussionResult>({ id: null, url: null, totalCount: 0, comments: [] })
  }

  const comments: GiscusComment[] = (discussion.comments.nodes ?? []).map(
    (c: { author?: { login?: string }; body: string; createdAt: string; url: string }) => ({
      author: c.author?.login ?? 'ghost',
      body: c.body,
      createdAt: c.createdAt,
      url: c.url,
    })
  )

  return NextResponse.json<DiscussionResult>({
    id: discussion.id,
    url: discussion.url,
    totalCount: discussion.comments.totalCount,
    comments,
  })
}

export async function POST(req: NextRequest) {
  const jar = await cookies()
  const userToken = jar.get('gh_token')?.value
  if (!userToken) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { slug, body } = (await req.json()) as { slug: string; body: string }
  if (!slug || !body?.trim()) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  // find existing discussion
  let discussionId: string | null = null
  const searchJson = await ghGraphQL(
    SEARCH_QUERY,
    { q: `repo:${REPO} ${slug} in:title` },
    userToken
  )
  discussionId = searchJson?.data?.search?.nodes?.[0]?.id ?? null

  // create if not found
  if (!discussionId) {
    const createJson = await ghGraphQL(
      CREATE_DISCUSSION,
      {
        repoId: REPO_ID,
        categoryId: CATEGORY_ID,
        title: slug,
        body,
      },
      userToken
    )
    console.error('[comments] createDiscussion response:', JSON.stringify(createJson))
    discussionId = createJson?.data?.createDiscussion?.discussion?.id ?? null
  }

  if (!discussionId)
    return NextResponse.json({ error: 'could not create discussion' }, { status: 500 })

  const commentJson = await ghGraphQL(ADD_COMMENT, { discussionId, body }, userToken)
  const comment = commentJson?.data?.addDiscussionComment?.comment

  if (!comment) return NextResponse.json({ error: 'failed to post' }, { status: 500 })

  return NextResponse.json<GiscusComment>({
    author: comment.author?.login ?? 'ghost',
    body: comment.body,
    createdAt: comment.createdAt,
    url: comment.url,
  })
}
