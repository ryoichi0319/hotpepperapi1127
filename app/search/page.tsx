"use client"
import { useEffect, useRef, useState } from "react";

type User ={
  id: string,
  name: string,
  email: string
}

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState<User[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        return res.json();
      })
      .then((data) => setUsers(data));
  }, []);

  
  // 検索機能の追加
  const handleSearch = () => {
    if (ref.current) {
      const searchTerm = ref.current.value.toLowerCase();

    //フィルタリング機能
    setSearchQuery(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      )
    );}

    console.log(searchQuery);
  };

  return (
    <div >
      <div >
        <h2>検索アプリ</h2>
        <input type="text" ref={ref} onChange={() => handleSearch()} />
        <div >
          {searchQuery.map((user) => (
            <div key={user.id}>
              <h3>{user.name}</h3>
              <hr />
              <p>{user.email}</p>
            </div>
          ))}
          {/* <div className="box">
            <h3>ユーザー名</h3>
            <hr />
            <p>メールアドレス</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;