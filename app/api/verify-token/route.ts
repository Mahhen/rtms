export async function GET(_: Request) {
    const verif = { message: "verified" }
    return new Response(JSON.stringify(verif), { status: 200 })
}