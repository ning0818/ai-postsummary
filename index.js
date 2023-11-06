 import ss from "simplest-server";
import fetch from "node-fetch";

ss.http({
    '/': function(req, res){
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Vercel-CDN-Cache-Control', 'max-age=7200');
        res.setHeader('Cache-Control', 'max-age=7200');
        fetch("https://wetabchat.haohuola.com/api/chat/conversation-v2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 4 Prime) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36"
            },
            body: JSON.stringify({"prompt":"概述一下这篇文章：${ req.getQueryVariable("content", "") }","assistantId":"","model":"650e52e9c4bcb4a52791b599"})
        }).then(function (response) {
            response.text().then(function(t){
                var ls = t.split("\n\n")
                var word = ""
                for (let i in ls) {
                    var data = (JSON.parse((ls[i].split("\n")[1]||"data: {}").slice(6).trim() || "{}").data || "").toString().replaceAll("data: ", "").trim()
                    if (data.indexOf("[DONE]")) {
                        try{
                            word+=JSON.parse(data).choices[0].delta.content || ""
                        } catch {
                            res.setHeader('Vercel-CDN-Cache-Control', 'max-age=0');
                            res.setHeader('Cache-Control', 'max-age=0');
                            word+=""
                        }
                    }
                }
                res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
                res.end(JSON.stringify({summary: word}));
            })
        });
    }}).listen(3000)
    