import { client } from "../../libs/client";

	export default async (req, res) => {

	  // リクエストにスラッグがない場合は404エラーを表示
	  if (!req.query.slug) {
	    return res.status(404).end();
	  }

	  // 記事が存在するか確かめる
	  const content = await client.get({
	    endpoint: 'blog',
	    contentId: req.query.slug,
	    queries: {draftKey: req.query.draftKey}
	  }).then().catch(error => console.error(error));

	  // 記事が返ってこない場合は401エラーを表示する
	  if (!content) {
	    return res.status(401).json({ message: 'Invalid slug' });
	  }

	  // 記事のIDとdraftKeyを渡して本来のパスにリダイレクトする
	  res.setPreviewData({
	    slug: content["id"],
	    draftKey: req.query.draftKey,
	  });
	  res.writeHead(307, { Location: `/blog/${content["id"]}` });
	  res.end('Preview mode enabled');
	};