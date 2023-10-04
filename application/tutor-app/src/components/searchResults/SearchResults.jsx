import { useState, useEffect } from "react"
import axios from "axios";
import "../admin/admin.css";
import { useLocation } from 'react-router-dom';

const SearchResults = () =>{
    const [resultsList, setResultsList] = useState([]);
    const location = useLocation(); //tracks the query params


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

            setResultsList([...searchResults.data.searchResults]);
        }
        getSearchResults();
    }, [location.search]); //when the query params change (because the user searched something else) trigger loading the new search results


    return (
        <div className="search-results">
            <h3>Showing {resultsList.length} search results</h3>
            <div className="search-results-box">
                {
                    resultsList.map( (tutor, index ) => {
                        return <UserResult username={tutor.username} userId={tutor.id} imgUrl={tutor.img_url} key={index} index={index} />
                    })
                }
            </div>
        </div>
    )

}


const UserResult = ({username, userId, imgUrl }) => {

    const handleContact = () => {
        //TODO send a message to the tutor
    }

    return (
    <div className = "user-result">
            <img className="user-img" src={imgUrl} alt="pic"/>
            <p>{username}</p>
            <button onClick={handleContact}>Contact</button>
            <button>{username}'s Profile</button>
    </div>
    );


}

export default SearchResults;