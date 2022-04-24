import React, { useState, useEffect } from "react";
import axios from "axios";
//en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=programming

const Search = () => {
  const [term, setTerm] = useState("programming");
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout (() =>{
      setDebouncedTerm(term);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [term]);

  //ovo obezbedjuje i da se odmah renderuje komponanta, be zakasnjenja, jer se trigeuje inicijalno i kada se promeni dbonceTerm, te ne moramo da ispitujemo da li postoji lenth rezultata (da je prvo renderovanje) jer ce difoltno ovo da se renderuje (a time i difoltni term) odmah (bez zakasnjenja). Sa zakanjenjem ce jedino prvi useEffect da hendluje promene na inputu i da unaprejuje ovaj stejt a time i da trigeruje ovaj useEffect
  useEffect(() => {
    const search = async () => {
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          format: "json",
          srsearch: debouncedTerm,
          origin: "*",
        },
      });
      setResults(data.query.search);
    };

    search();

  }, [debouncedTerm]);

  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
            className="ui button"
          >
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">{result.title}</div>
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter Search Term</label>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="input"
          />
        </div>
      </div>
      <div className="ui celled list">{renderedResults}</div>
    </div>
  );
};

export default Search;
