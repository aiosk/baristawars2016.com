const delay = (()=> {
    let timer = 0;
    return (callback, ms, clear = false)=> {
        if (clear) {
            clearTimeout(timer)
        }
        timer = setTimeout(callback, ms)
    }
})();
