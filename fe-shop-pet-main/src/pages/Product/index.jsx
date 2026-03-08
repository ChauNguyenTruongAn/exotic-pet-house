import { useEffect, useState } from 'react';

import styles from './Product.module.scss';
import ProductGrid from '../../components/ProductGrid';
import ProductSort from '../../components/ProductSort';
import ProductPagination from '../../components/ProductPagination';
import productApi from '../../apis/productApis';
import categoryApis from '../../apis/categoryApis';
import speciesApis from '../../apis/speciesApis';
import EmptyProduct from '../../components/EmptyProduct';
import { useSearch } from '../../context/search';

const PRICE_RANGE = {
    0: 'null-200000',
    1: '200000-500000',
    2: '500000-1000000',
    3: '1000000-10000000',
    4: '10000000-null',
};

export default function Product() {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [species, setSpecies] = useState([]);
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState({ priceRange: [], speciesIds: [] });
    const [sort, setSort] = useState({ sort: 'name,asc' });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { search, isSearch, setIsSearch } = useSearch();

    useEffect(() => {
        const fetch = async () => {
            const response = await productApi.getAllProductByFilter({
                size: 10,
                page: page - 1,
                sort: sort.sort,
                ...filter,
            });
            const { content, totalPages } = response.data;

            setProducts(content);
            setTotalPages(totalPages);
        };

        fetch();
    }, [page, sort, filter]);

    useEffect(() => {
        const fetch = async () => {
            const categories = await categoryApis.getAllCategories();
            const species = await speciesApis.getAllSpecies();
            setCategories(categories.data.data);
            setSpecies(species.data.data);
        };

        fetch();
    }, []);

    useEffect(() => {
        if (search.trim() !== '') {
            setFilter({
                priceRange: [],
                speciesIds: [],
                name: search.trim(),
            });
        }
        setIsSearch(false);
    }, [search, isSearch]);

    const handleChangePage = (number) => {
        setPage(number);
    };

    const handleSort = (item) => {
        setSort(item);
    };

    const handleFilterPrice = ({ value, checked }) => {
        if (checked) {
            setFilter({ ...filter, priceRange: [...filter.priceRange, PRICE_RANGE[value]] });
        } else {
            setFilter({ ...filter, priceRange: filter.priceRange.filter((i) => i !== PRICE_RANGE[value]) });
        }
    };

    const handleFilterSpecies = (item, { checked }) => {
        if (checked) {
            setFilter({ ...filter, speciesIds: [...filter.speciesIds, item.id] });
        } else {
            setFilter({
                ...filter,
                speciesIds: filter.speciesIds.filter((i) => {
                    return i !== item.id;
                }),
            });
        }
    };

    const handleFilterCategory = (item) => {
        setFilter({ ...filter, categoryId: item.id });
        setSelectedCategories(item.id);
    };

    return (
        <div className={styles['container']}>
            <aside className={styles['sidebar']}>
                <div>
                    <h3
                        className={styles['title']}
                        onClick={() => setFilter({ priceRange: [], speciesIds: [], categoryId: null })}
                    >
                        Danh mục
                    </h3>
                    <ul>
                        {categories.map((item) => (
                            <li
                                key={item.id}
                                style={item.id == selectedCategories ? { color: 'red' } : {}}
                                onClick={() => handleFilterCategory(item)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3
                        className={styles['title']}
                        onClick={() => {
                            setFilter((prev) => ({ ...prev, priceRange: [], speciesIds: [] }));
                        }}
                    >
                        Bộ lọc
                    </h3>
                    <h3>GIÁ SẢN PHẨM</h3>
                    <div>
                        <input
                            type="checkbox"
                            name=""
                            id="price1"
                            checked={filter.priceRange.includes(PRICE_RANGE[0])}
                            value={0}
                            onChange={(e) => handleFilterPrice(e.target)}
                        />
                        <label htmlFor="price1">Giá dưới 200.000đ</label>
                        <br />

                        <input
                            type="checkbox"
                            name=""
                            id="price2"
                            value={1}
                            checked={filter.priceRange.includes(PRICE_RANGE[1])}
                            onChange={(e) => handleFilterPrice(e.target)}
                        />
                        <label htmlFor="price2">200.000đ - 500.000đ</label>
                        <br />

                        <input
                            type="checkbox"
                            name=""
                            id="price3"
                            value={2}
                            checked={filter.priceRange.includes(PRICE_RANGE[2])}
                            onChange={(e) => handleFilterPrice(e.target)}
                        />
                        <label htmlFor="price3">500.000đ - 1.000.000đ</label>
                        <br />

                        <input
                            type="checkbox"
                            name=""
                            id="price4"
                            value={3}
                            checked={filter.priceRange.includes(PRICE_RANGE[3])}
                            onChange={(e) => handleFilterPrice(e.target)}
                        />
                        <label htmlFor="price4">1.000.000đ - 10.000.000đ</label>
                        <br />

                        <input
                            type="checkbox"
                            name=""
                            id="price5"
                            value={4}
                            checked={filter.priceRange.includes(PRICE_RANGE[4])}
                            onChange={(e) => handleFilterPrice(e.target)}
                        />
                        <label htmlFor="price5">Giá trên 10.000.000đ</label>
                    </div>

                    <div>
                        <h3>LOÀI</h3>
                    </div>
                    <div>
                        {filter.categoryId == null
                            ? species.map((item) => (
                                  <>
                                      <input
                                          type="checkbox"
                                          name=""
                                          id={item.id + item.name}
                                          checked={filter.speciesIds.includes(item.id)}
                                          onChange={(e) => handleFilterSpecies(item, e.target)}
                                      />
                                      <label htmlFor={item.id + item.name}>{item.name}</label>
                                      <br />
                                  </>
                              ))
                            : species
                                  .filter((item) => item.categoryId === filter.categoryId)
                                  .map((item) => (
                                      <>
                                          <input
                                              type="checkbox"
                                              name=""
                                              id={item.id + item.name}
                                              checked={filter.speciesIds.includes(item.id)}
                                              onChange={(e) => handleFilterSpecies(item, e.target)}
                                          />
                                          <label htmlFor={item.id + item.name}>{item.name}</label>
                                          <br />
                                      </>
                                  ))}{' '}
                    </div>
                </div>
            </aside>

            <main className={styles['main']}>
                {products.length === 0 ? (
                    <EmptyProduct type="empty" />
                ) : (
                    <>
                        <ProductSort title="Tất cả sản phẩm" handleSort={handleSort} />
                        <ProductGrid products={products} />
                        <ProductPagination page={page} totalPages={totalPages} handleChangePage={handleChangePage} />
                    </>
                )}
            </main>
        </div>
    );
}
