export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const category = searchParams.get("category") || "";

  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSz_bAFzKABIVfxs_JMng7dbG-b7CroWaDwq1MnEJN-gbEZxp-zfIqbvIHRTtk-7x3xKgdJzB7-9s6M/pub?gid=0&single=true&output=csv";

  const res = await fetch(sheetURL, {
    cache: "no-store",
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

  // Get all unique categories
  const allCategories = [...new Set(allLinks.map((item) => item.category).filter(Boolean))];

  // Filter by category if provided
  if (category) {
    allLinks = allLinks.filter((item) => item.category === category);
  }

  const totalLinks = allLinks.length;
  const totalPages = Math.ceil(totalLinks / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allLinks.slice(start, end);

  return Response.json({
    data,
    pagination: {
      totalLinks,
      totalPages,
      currentPage: page,
      limit,
    },
    categories: allCategories,
  });
}
