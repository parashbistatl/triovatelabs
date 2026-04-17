export async function onRequest(context) {
    const url = new URL(context.request.url);

    // Redirect any *.pages.dev hostname to your primary domain
    if (url.hostname.endsWith(".pages.dev")) {
        url.hostname = "triovatelabs.com";
        url.protocol = "https:";
        return Response.redirect(url.toString(), 301);
    }

    return context.next();
}
