export async function GET(request: Request) {
    const pong = { messsage: "pong" }
    return new Response(JSON.stringify(pong), { status: 200 })
}