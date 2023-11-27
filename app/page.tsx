import Image from "next/image";
import Link from "next/link"
import PaginationButton from "./pager/Pagination"
import { postPerPage } from "@/lib/utils"

interface HomeProps{
  searchParams: {
    [key: string]: string | undefined
  }
}

// リクエストごとに呼び出されます。
export async function getFetch({ offset, limit }: { offset: number, limit: number }){
  const apiKey = process.env.API_KEY;

  const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

  // const keywordParam = keyword ? `&keyword=${encodeURIComponent(keyword)}` : '';

  const serviceAria = "X385"; // サービスエリアを指定

  const serviceAriaOsaka = "SA23";
  const format = "json";

  console.log(offset,"offset")
  console.log(limit,"limit")
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&service_area=${serviceAriaOsaka}&genre=G012&count=${limit}&order=1&format=${format}&start=${offset}`
  );

  const data = await res.json();
  const { results } = data;

  return { results };
}
async function getTotalDataCount()  {
  const apiKey = process.env.API_KEY;
  const baseUrl = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
  const serviceAria = "X385"; // サービスエリアを指定
  const serviceAriaOsaka = "SA23";

  const format = "json";

  const firstRes = await fetch(
    `${baseUrl}?key=${apiKey}&service_area=${serviceAriaOsaka}&genre=G012&format=${format}`
  );

  const firstData = await firstRes.json();
  const totalCount = firstData.results.results_available; // レスポンスによっては異なるプロパティを確認

  return totalCount;
}



export default async function Home({searchParams}: HomeProps){
  const { page, perPage } = searchParams;
  const limit = typeof perPage === "string" ? parseInt(perPage) : postPerPage;
  console.log(page,"prevpage")
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0
  console.log(page,"page")
 
  const fetchData = await getFetch({
    offset: offset,
    limit: limit,
  }); // 使用例
const totalDataCount = await getTotalDataCount();
console.log("Total Data Count:", totalDataCount);
console.log(searchParams,"searchParams")
 
  const pageCount = Math.ceil(totalDataCount / limit);
  return (
    <main className="max-w-screen-lg mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">ホットペッパー 大阪バーサーチ</h1>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {fetchData.results.shop.map((data: any) => (
          <li key={data.id} className="bg-white p-4 rounded-md shadow-md">
           <div className="w-[250px]">
            <Link href={data.urls.pc} >
              
              <Image
                className=" aspect-[16/9] rounded-md"
                src={data.photo.pc.m}
                alt={data.name}
                width={250}
                height={250}
                priority
              />
            </Link>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold">
                <a href={data.urls.pc}>{data.name}</a>
              </h3>
              <p className="text-gray-600">{data.catch}</p>
              <p className="text-gray-700">{data.address}</p>
              <p className="text-gray-900">営業時間: </p><p>{data.open}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className=" mt-6">
      <PaginationButton pageCount={pageCount} displayPerPage={postPerPage} />
      </div>
    </main>
  );
}
