export { }

const initExePage = (evt) => {
    console.log("evt:", evt);
    const { width, height } = evt;
    const pageW = 800;
    const pageH = 500;
    // const top = Math.round(screen.width / 2 - pageW / 2)
    // const left = Math.round((screen.height / 2 - pageH / 2))
    const top = Math.round(height / 3);
    const left = Math.round(width / 3);
    chrome.windows.create({
        focused: true,
        top,
        left,
        width: pageW,
        height: pageH,
        type: 'popup',
        url: '/tabs/exe.html'
    })
}

chrome.action.onClicked.addListener(initExePage);