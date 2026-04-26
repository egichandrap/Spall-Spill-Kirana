export async function GET() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_bAFzKABIVfxs_JMng7dbG-b7CroWaDwq1MnEJN-gbEZxp-zfIqbvIHRTtk-7x3xKgdJzB7-9s6M/pub?gid=0&single=true&output=csv";

  const res = await fetch(sheetURL, {
    cache: "no-store",
  });

  const text = await res.text();

  const rows = text.split("\n").slice(1);

  const data = rows.map((row) => {
    const [title, link, image, category] = row.split(",");

    return {
      title: title?.trim(),
      link: link?.trim(),
      image: image?.trim(),
      category: category?.trim(),
    };
  }).filter(item => item.title && item.link);

  return Response.json(data);
}