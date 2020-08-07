export default (data?:Array<any>) => {
    const item = data.toString().replace(/,/g,'');
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <title>Westmanga</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <style>
                body {
                    padding: 0;
                    margin: 0;
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            </style>
            </head>
            <body>
                <div style="height: 60px;"></div>
                <div id="view"> ${item}</div>
                <div style="height: 150px;"></div>
            </body>
            <script>
                const el = document.getElementById('view');
                el.addEventListener('click',() => {
                     window.ReactNativeWebView.postMessage("up")
                });
            </script>
            </html>`
}