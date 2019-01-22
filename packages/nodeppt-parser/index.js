
const ejs = require('ejs')

module.exports = content => {
  const html = md.render(content)

  ejs.renderFile('<%= people.join(", "); %>', {people: people});
  return `
  <!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>NodePPT</title>
    </head>
    <body>
        ${html}
    </body>
</html>

  `
}
