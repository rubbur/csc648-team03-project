import { useState, useEffect } from "react"
import axios from "axios";

const SearchResults = () =>{
    const [resultsList, setResultsList] = useState([]);
    //get the search results based on the query params
    useEffect(() =>{
        const getSearchResults = async () =>{
            //get the subject and the search term from the queryparams
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);
            const subject = params.get('subject');
            const searchTerm = params.get('searchterm');
            
            //get the results from the backend
            const searchResults = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/user/searchTutors`,
                {subject: subject, searchTerm: searchTerm}, 
                {withCredentials: true}
                );

            console.log(searchResults.data);
        }
        getSearchResults();
    }, []);


    return (
        <div className="search-results">
            <h3>Showing {resultsList.length} search results</h3>
        </div>
    )

}

export default SearchResults;