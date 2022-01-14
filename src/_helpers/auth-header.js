export function authHeader(contentType = null) {
    // return authorization header with basic auth credentials
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.authdata) {
        if (contentType) {
            return { 'Authorization': 'Basic ' + user.authdata, 'Content-Type': contentType };
        }
        return { 'Authorization': 'Basic ' + user.authdata };
    } else {
        if (contentType) {
            return { 'Content-Type': contentType }
        }
        return {};
    }
}