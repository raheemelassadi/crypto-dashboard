import { createContext, useLayoutEffect, useState } from "react";

// create context object
export const CryptoContext = createContext({});

// create the provider component
export const CryptoProvider = ({ children }) => {
  const [cryptoData, setCryptoData] = useState();
  const [searchData, setSearchData] = useState();
  const [coinData, setCoinData] = useState();

  const [coinSearch, setCoinSearch] = useState("");

  const [currency, setCurrency] = useState("usd");
  const [sortBy, setSortBy] = useState("market_cap_desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(250);
  const [perPage, setPerPage] = useState(10);

  const [error, setError] = useState({ data: "", coinData: "", search: "" });

  const proxyUrl = "https://cors.bridged.cc/";

  const getCryptoData = async () => {
    setError({ ...error, data: "" });
    setCryptoData();
    setTotalPages(13220);

    try {
      const response = await fetch(
        `${proxyUrl}https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinSearch}&order=${sortBy}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Crypto Data:", data);
      setCryptoData(data);
    } catch (error) {
      console.log("Error fetching crypto data:", error);
      setError({ ...error, data: error.message });
    }
  };

  const getCoinData = async (coinid) => {
    setCoinData();
    try {
      const response = await fetch(
        `${proxyUrl}https://api.coingecko.com/api/v3/coins/${coinid}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Coin Data:", data);
      setCoinData(data);
    } catch (error) {
      console.log("Error fetching coin data:", error);
      setError({ ...error, coinData: error.message });
    }
  };

  const getSearchResult = async (query) => {
    try {
      const response = await fetch(
        `${proxyUrl}https://api.coingecko.com/api/v3/search?query=${query}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Search Result Data:", data);
      setSearchData(data.coins);
    } catch (error) {
      console.log("Error fetching search results:", error);
      setError({ ...error, search: error.message });
    }
  };

  const resetFunction = () => {
    setPage(1);
    setCoinSearch("");
  };

  useLayoutEffect(() => {
    getCryptoData();
  }, [coinSearch, currency, sortBy, page, perPage]);

  return (
    <CryptoContext.Provider
      value={{
        cryptoData,
        searchData,
        getSearchResult,
        setCoinSearch,
        setSearchData,
        currency,
        setCurrency,
        sortBy,
        setSortBy,
        page,
        setPage,
        totalPages,
        resetFunction,
        setPerPage,
        perPage,
        getCoinData,
        coinData,
        error,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
