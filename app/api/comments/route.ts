import { NextRequest, NextResponse } from 'next/server'

const REPO = process.env.NEXT_PUBLIC_GISCUS_REPO ?? ''
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''
const TOKEN = process.env.GITHUB_TOKEN ?? ''

export interface GiscusComment {
  author: string
  body: string
  createdAt: string
  url: string
}

export interface DiscussionResult {
  url: string | null
  totalCount: number
  comments: GiscusComment[]
}

const QUERY = `
query($query: String!) {
  search(query: $query, type: DISCUSSION, first: 1) {
    nodes {
      ... on Discussion {
        url
        comments(first: 50) {
          totalCount
          nodes {
            author { login }
            body
            createdAt
            url
          }
        }
      }
    }
  }
}
`

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? ''

  if (!REPO || !TOKEN) {
    return NextResponse.json<DiscussionResult>({ url: null, totalCount: 0, comments: [] })
  }

  const searchQuery = `repo:${REPO} ${slug} in:title`

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY, variables: { query: searchQuery } }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return NextResponse.json<DiscussionResult>({ url: null, totalCount: 0, comments: [] })
  }

  const json = await res.json()
  const discussion = json?.data?.search?.nodes?.[0]

  if (!discussion) {
    return NextResponse.json<DiscussionResult>({ url: null, totalCount: 0, comments: [] })
  }

  const comments: GiscusComment[] = (discussion.comments.nodes ?? []).map((c: any) => ({
    author: c.author?.login ?? 'ghost',
    body: c.body as string,
    createdAt: c.createdAt as string,
    url: c.url as string,
  }))

  return NextResponse.json<DiscussionResult>({
    url: discussion.url,
    totalCount: discussion.comments.totalCount,
    comments,
  })
}
