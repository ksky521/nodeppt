<!--
    Powered By nodePPT
    version: <%= version %>
    site: <%= site %> 
    date: <%= grunt.template.today('yyyy-mm-dd') %>
-->
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>nodePPT List</title>
    <style>
    body{
        color:#888;
    }
    ul,li{
        list-style:none;
        padding:0;
        margin:0;
    }
    li{
        line-height: 2em;
    }
    a,a:visited{
        color:#4183c4;
        font-weight: bold;
        text-decoration: none;
    }
    a::before{
        content:'☆ ';
    }
    a:visited:before{
        content:'★ ';
    }
    </style>
</head>
<body>
    <h3>当前路径：<%= dir %></h3>
    <ul>
        <%= list %>
    </ul>
    <center>Powered by <a href="https://github.com/ksky521/nodePPT" target="_blank">NodePPT</a></center>
</body>
</html>