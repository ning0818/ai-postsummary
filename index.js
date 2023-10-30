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
        fetch("https://gpt.haixuntech.cn/api/v1/conversation/ChatV2", {
            method: "POST",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTkxOTAxNTMsImlhdCI6MTY5ODU1MDE1Mywiand0VXNlcklkIjoiNjUzZGQxODk3MzRhYmY5YTQ2ZWUwMjBhIn0.ZfGyz89Lj61tKx5TMHtvx3HhmPykj-ERT80-bFEJW-E",
                "Referer": "https://gpt.haixuntech.cn/chat/653dd199734abf9a46ee024b",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.69"
            },
            body: JSON.stringify({
                messages: `[{"conversation_id":"653f508b734abf9a46f06071","content":"概述一下这篇文章：${ req.getQueryVariable("content", "") }","chat_context_id_list":[],"is_gpt4":false,"model_name":"gpt-3.5-turbo","system_role_prompt":"Chat Ai对话","base_request":{"platform_type":"Web","client_version":"2.1","trace_id":"","signature":"","share":""}}]`
            })
        })
        fetch("https://gpt.haixuntech.cn/api/v1/conversation/RefreshChat", {
            method: "POST",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTkxOTAxNTMsImlhdCI6MTY5ODU1MDE1Mywiand0VXNlcklkIjoiNjUzZGQxODk3MzRhYmY5YTQ2ZWUwMjBhIn0.ZfGyz89Lj61tKx5TMHtvx3HhmPykj-ERT80-bFEJW-E",
                "Referer": "https://gpt.haixuntech.cn/chat/653dd199734abf9a46ee024b",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.69"
            },
            body: JSON.stringify({
                messages: `[{"chat_result_id":"653f565e734abf9a46f07671","base_request":{"platform_type":"Web","client_version":"2.1","trace_id":"","signature":"","share":""}}]`
            })
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
    