import react, { useState, useEffect } from "react";
import { useHistory, Redirect, useParams } from "react-router-dom";
import axios from "axios";
import Form from "./Form";
import styled from "styled-components";

function Edit({ token }) {
  const [getMovie, setGetMovie] = useState();
  const [genres, setGenres] = useState([]);
  const [checkedGenres, setCheckedGenres] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    getMovieApi();
    getGenresApi();
  }, []);

  function getMovieApi() {
    axios
      .get(`http://localhost:8888/aewordpress/wp-json/wp/v2/movies/${id}`)
      .then((response) => {
        let movie = {
          title: response.data.title.rendered,
          status: "publish",
          recension: response.data.acf.recension,
          rating: response.data.acf.rating,
          genres: response.data.genres,
          acf: {
            genrecustom: [
              response.data.acf.genrecustom.map((x) => {
                return x.name;
              }),
            ],
          },
        };

        setGetMovie(movie);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setGetMovie({ ...getMovie, [name]: value });
  }

  let result;

  if (getMovie) {
    result = getMovie.genres.filter((x) => {
      return genres.some((genre) => {
        return x === genre.id;
      });
    });
  }

  function getGenresApi() {
    axios
      .get("http://localhost:8888/aewordpress/wp-json/wp/v2/genres")
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onChangeGenre(e) {
    const isChecked = e.target.checked;
    if (isChecked) {
      let idInt = parseInt(e.target.id);
      setCheckedGenres([...checkedGenres, idInt]);
    } else if (!isChecked) {
      let filteredGenre = checkedGenres.filter((genre) => {
        return genre !== parseInt(e.target.id);
      });
      setCheckedGenres(filteredGenre);
    }
  }

  function putMovie() {
    let item = {
      title: getMovie.title,
      status: "publish",
      genres: checkedGenres,
      fields: {
        genrecustom: checkedGenres,
        recension: getMovie.recension,
        rating: getMovie.rating,
      },
    };
    axios
      .put(
        `http://localhost:8888/aewordpress/wp-json/wp/v2/movies/${id}`,
        item,
        {
          headers: { Authorization: "Bearer" + token },
        }
      )
      .then((resp) => {
        if (resp.status === 200) {
          setIsAdded(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onClickEditMovie(e) {
    e.preventDefault();
    if (checkedGenres.length > 0) {
      if (getMovie.title.trim() === "" || getMovie.recension.trim() === "") {
        return setErrorMsg("emptyInput");
      }
      putMovie(token);
    } else {
      setErrorMsg("checkbox");
    }
  }
  function redirect() {
    history.push("/");
  }

  return (
    <main className="EditDiv">
      {isAdded && <Redirect to="/" />}

      <div className="divHeader">
        <h1>Ändra film</h1>
        <button onClick={redirect}>Tillbaka</button>
      </div>
      {getMovie && (
        <Form
          newMovie={getMovie}
          genres={genres}
          handleSubmit={onClickEditMovie}
          submitButtonText="Ändra"
          result={result}
          handleChange={handleChange}
          onChangeGenre={onChangeGenre}
          errorMsg={errorMsg}
        />
      )}

      {getMovie && getMovie.acf.genrecustom && (
        <GenresInEdit>
          <ul>
            Valda genres innan edit:
            {getMovie.acf.genrecustom.map((genreName) => {
              return genreName.map((name, x) => {
                return <li key={x}>{name} </li>;
              });
            })}
          </ul>
        </GenresInEdit>
      )}
    </main>
  );
}

export default Edit;

const GenresInEdit = styled.div`
  width: 80%;
  height: auto;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
   ul {
    padding: 0;
    list-style: none;
  }
`;
