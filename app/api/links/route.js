export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const category = searchParams.get("category") || "";

  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_bAFzKABIVfxs_JMng7dbG-b7CroWaDwq1MnEJN-gbEZxp-zfIqbvIHRTtk-7x3xKgdJzB7-9s6M/pub?gid=0&single=true&output=csv";

  const res = await fetch(sheetURL, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });

  const text = await res.text();

  const rows = text.split("\n").slice(1);

  let allLinks = rows.map((row) => {
    const [no, title, link, image, category] = row.split(",");

    return {
      no: no?.trim(),
      title: title?.trim(),
      link: link?.trim(),
      image: image?.trim(),
      category: category?.trim(),
    };
  }).filter((item) => item.title && item.link);

  const allCategories = [...new Set(allLinks.map((item) => item.category).filter(Boolean))];

  if (category) {
    allLinks = allLinks.filter((item) => item.category === category);
  }

  const totalLinks = allLinks.length;
  const totalPages = Math.ceil(totalLinks / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allLinks.slice(start, end);

  return new Response(JSON.stringify({
    data,
    pagination: {
      totalLinks,
      totalPages,
      currentPage: page,
      limit,
    },
    categories: allCategories,
  }), {
    status: 200,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Content-Type": "application/json",
    },
  });
}
