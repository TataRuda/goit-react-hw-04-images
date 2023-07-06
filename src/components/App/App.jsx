import { useState, useEffect } from "react";
import { fetchData } from 'api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from '../Searchbar/Searchbar';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Modal } from '../Modal/Modal';
import { Loader } from '../Loader/Loader';
import { Button } from 'components/Button/Button';
import css from './App.module.css';


export const App = () => {
  
  const [ query, setQuery ] = useState('');
  const [ searchResults, setSearchResults] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ showModal, setShowModal ] = useState(false);
  const [ largeImageURL, setLargeImageURL] = useState(null);
  const [ isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if query or page are changed then load images with new search options.
    if(!query || !page) return; 
    fetchImages(query, page)
    }, [query, page]);

  const fetchImages = (query, page) => {
    setIsLoading(true);
      fetchData (query, page)
        .then(({hits}) => {
          if (hits.length === 0) {
            toast.warn('Oops! No results for your query',  {
              position: toast.POSITION.TOP_LEFT
            });
          };
          const data = hits.map(({ id, webformatURL, largeImageURL }) => {
            return {
              id,
              webformatURL,
              largeImageURL,
              };
          });
          setSearchResults(searchResults => [...searchResults,...data]);
        })
        .catch((error) => {
          console.log('Error fetching images:', error);
          toast.error('Error fetching images', {
            position: toast.POSITION.TOP_RIGHT
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
  };
  
  const handleSearchSubmit =  (query)  => {
    setQuery(query);
    setSearchResults([]);
    setIsLoading(true);
    setPage(1);
  };

  const handleInputChange = (query) => {
    setQuery(query);
  };   
   
  const loadMoreImages = () => {
    setPage( page => page + 1);
  };

  const toggleModal = (largeImageURL) => {
    setShowModal(!showModal);
    setLargeImageURL(largeImageURL);
  };
     
  const showLoadMoreButton = searchResults.length >= 12 && !isLoading; 
    
  return (
    <div className={css.containerApp}>
      <Searchbar onSubmit={handleSearchSubmit} value={query} onChange={handleInputChange}/>
      {searchResults.length !== 0 && <ImageGallery searchResults={searchResults} onClick={toggleModal}/>}
      {isLoading === true && <Loader/>}
      {showModal && (
          <Modal onClose={toggleModal} largeImageURL={largeImageURL}/>
        )}
      {showLoadMoreButton && 
        (<Button onClick={loadMoreImages}/>)}
      <ToastContainer />       
    </div>
  );

};
