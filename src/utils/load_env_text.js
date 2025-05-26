
export const load_pk = () => {
    const addresses = process.env.PK?.split(",") || []; // Convert to array
    return addresses
}

export const load_proxy = () => {
    const proxys = process.env.PROXY?.split(",") || [];
    for(let i = 0; i < proxys.length; i ++ ) {
        if(proxys[i] === "none") {
            proxys[i] = undefined
        }
    }
    return proxys
}