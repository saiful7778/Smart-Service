import { db } from "@/lib/db"
import { rpcHandler } from "@/server/orpc.handler"
import { NextRequest, NextResponse } from "next/server"

async function handleRequest(request: NextRequest) {
  const { response } = await rpcHandler.handle(request, {
    prefix: "/orpc",
    context: {
      reqHeaders: request.headers,
      db,
    },
  })

  return (
    response ??
    NextResponse.json(
      {
        defined: true,
        code: "NOT_FOUND",
        status: 404,
        message: `'${request.url}' - is not found`,
      },
      { status: 404 }
    )
  )
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
