import react, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

function Movies({ token }) {
  const [movies, setMovies] = useState();
  let history = useHistory();

  useEffect(() => {
    getMovies();
  }, []);

  function getMovies() {
    axios
      .get("http://localhost:8888/aewordpress/wp-json/wp/v2/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteMovie(movieId) {
    axios
      .delete(
        `http://localhost:8888/aewordpress/wp-json/wp/v2/movies/${movieId}`,
        {
          headers: { Authorization: "Bearer" + token },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          getMovies();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  let mappedMovies;

  if (movies) {
    mappedMovies = movies.map((movie) => {
      return (
        <OneMovieDiv key={movie.id}>
          <div>
            <p>
              <strong>Titel</strong> <br />
              {movie.title.rendered}
            </p>
          </div>
          {movie.acf.cover ? (
            <img src={movie.acf.cover} />
          ) : (
            <img
              src={
                "https://pbs.twimg.com/profile_images/836629578554748928/DHbaSYYv_400x400.jpg"
              }
            />
          )}

          <div>
            <p>
              <strong>Recension</strong> <br />
              {movie.acf.recension}
            </p>
          </div>
          <div>
            <p>
              <strong>Rating</strong> <br />
              {movie.acf.rating}
              /5
            </p>
          </div>

          <div>
            <ul>
              <strong>Genre</strong>
              {movie.acf.genrecustom.length > 0 &&
                movie.acf.genrecustom.map((x) => {
                  return <li key={x.term_id}> {x.name}</li>;
                })}
            </ul>
          </div>
          <div>
            <button
              onClick={() => {
                deleteMovie(movie.id);
              }}
            >
              Ta bort
            </button>

            <button
              onClick={() => {
                redirectEdit(movie.id);
              }}
            >
              Ändra
            </button>
          </div>
        </OneMovieDiv>
      );
    });
  } else {
    mappedMovies = <p>No movies</p>;
  }

  function redirectAdd() {
    history.push("/add");
  }

  function redirectEdit(movieId) {
    history.push(`/edit/${movieId}`);
  }

  return (
    <main className="MoviesDiv">
      <div className="divHeader">
        <h1>Alla filmer</h1>
        <button onClick={redirectAdd}>Lägg till film</button>
      </div>
      <MoviesContent> {mappedMovies} </MoviesContent>
    </main>
  );
}

export default Movies;

const MoviesContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
  margin: 10px 0 0 0;
  box-sizing: border-box;
`;

const OneMovieDiv = styled.div`
  width: 95%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 2px solid #a3c3d8;

  div {
    margin: 5px;
    width: 15%;
  }
  img {
    width: 150px;
    height: 130px;
    border-radius: 5px;
    margin-right: 10px;
    object-fit: contain;
  }

  button {
    width: 65px;
    height: 22px;
    box-shadow: 0px 10px 10px -7px #80a4c0;
    background-color: #d0e2eb;
    border-radius: 15px;
    border: 2px solid #a3c3d8;
    display: inline-block;
    cursor: pointer;
    color: #456289;
    font-size: 12px;
    padding: 1px 5px;
    text-decoration: none;
    margin: 10px;
  }
  button:hover {
    background-color: #80a4c0;
    color: #d0e2eb;
  }
  ul {
    padding: 0;
    list-style: none;
  }
  p {
    margin: 0;
  }
`;
