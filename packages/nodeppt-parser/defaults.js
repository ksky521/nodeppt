module.exports = {
    title: 'nodeppt markdown',
    url: '',
    speaker: '',
    js: '',
    theme: 'moon',
    transition: 'move',
    highlightStyle: 'monokai_sublime',
    date: Date.now(),
    htmlWebpackPlugin: `
  <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
    <script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
    <% } %>
  `
};
