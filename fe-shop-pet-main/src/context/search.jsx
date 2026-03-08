import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(true);

    return (
        <SearchContext.Provider
            value={{
                isSearch,
                setIsSearch,
                search,
                setSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
