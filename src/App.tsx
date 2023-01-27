import { useState, useEffect, useMemo, Fragment } from 'react';
import classNames from 'classnames';

import styles from './App.module.css';

function App() {

  interface User {
    id: number
    name: string
    email: string
    phone: string
    website: string
    address: {
      street: string
      city: string
    }
  }

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [filterByDomain, setFilterByDomain] = useState(false);
  const [filterByPhone, setFilterByPhone] = useState('');
  
  async function fetchUsers() {
    setLoading(true)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('При запросе произошла ошибка: ', error)
      setError(true)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    if (filterByDomain) {
      return users.filter((user) => user.website.includes('.com'));
    }
    if (filterByPhone) {
      return users.filter((user) => user.phone.includes(filterByPhone));
    }

    return users;
  }, [filterByDomain, filterByPhone, users]);

  if (error) {
    return(
      <p className={classNames(styles.text, styles.text_error)}>Произошла ошибка! Посмотрите в консоль</p>
    )
  } else if (loading) {
    return <p className={styles.text}>Идёт загрузка...</p>
  } else {
    return(
      <>
        <div className={styles.input}>
          <label htmlFor="domen">Фильтрация по домену .com</label>
          <input
            id="domen"
            type="checkbox"
            checked={filterByDomain}
            onChange={(e) => setFilterByDomain(e.target.checked)}
          />
        </div>
        <div className={styles.input}>
          <label htmlFor="phone">Фильтрация по телефону</label>
          <input
            id="phone"
            type="text"
            value={filterByPhone}
            onChange={(e) => setFilterByPhone(e.target.value)}
          />
        </div>
        <div className={styles.box}>
          { filteredUsers?.map((user) =>
            <Fragment key={user.id}>
              <div className={styles.item}>
                <p>name: { user.name }</p>
                <p>email: { user.email }</p>
                <p>phone: { user.phone }</p>
              </div>
              <div className={styles.item}>
                <p>website: { user.website }</p>
                <p>street: { user.address.street }</p>
                <p>city: { user.address.city }</p>
              </div>
            </Fragment>
          ) }
        </div>
      </>
    );
  }
}

export default App;
