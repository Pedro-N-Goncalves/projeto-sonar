import React, { useState } from 'react';
import Post from '../../Post';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SearchBar, Container, Loader, EmptyItem } from '../styles'; 

import {
  ReactComponent as LoadingAnimation
} from '../../../icons/loading.svg';

export default function PostList ({
  posts, loading, onScroll, isLastPage
}) {
  const [ query, setQuery ] = useState ('');

  const filterPosts = () => {
    return posts.filter (post => {
      const { desc, user, songs, lyrics } = post;
      return ((user.name && standardize (user.name).indexOf (standardize (query)) >= 0)
        || (desc && standardize (desc).indexOf (standardize (query)) >= 0)
        || (songs.length > 0 && standardize (songs[0].name).indexOf (standardize (query)) >= 0)
        || (songs.length > 0 && standardize (songs[0].genre).indexOf (standardize (query)) >= 0)
        || (lyrics.length > 0 && standardize (lyrics[0].name).indexOf (standardize (query)) >= 0)
        || (lyrics.length > 0 && standardize (lyrics[0].genre).indexOf (standardize (query)) >= 0)
      );
    });
  }

  const standardize = text => {
    return text
      .toLowerCase ()
      .normalize ('NFD')
      .replace (/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, '')
  }

  const postList = filterPosts ();
  return (
    <Container>
      <SearchBar>
        <input
          name='query'
          autoComplete='off'
          placeholder='Pesquisar conteudo'
          className='search'
          onChange={e => setQuery (e.target.value)}
        />
      </SearchBar>
      {loading ?
        <EmptyItem>
          <div>
            <LoadingAnimation/>
          </div>
        </EmptyItem>
      : posts.length > 0 ?
        postList.length > 0 ?
          <InfiniteScroll
            dataLength={posts.length}
            next={onScroll}
            hasMore={!isLastPage}
            loader={
              <Loader>
                <LoadingAnimation/>
              </Loader>
            }
            endMessage={<></>}
          >
            {postList.map (post => (
              <Post key={post.id} data={post} />
            ))}
          </InfiniteScroll>
        : <EmptyItem>
            <p> N??o foi encontrado nenhum resultado para sua pesquisa </p>
          </EmptyItem>
      : <EmptyItem>
          <p> Ainda n??o h?? postagens nessa categoria </p>
        </EmptyItem>
      }
    </Container>
  );
}
