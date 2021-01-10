import react, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
import Form from "./Form";
import styled from "styled-components";

function Add({ token }) {
  const [genres, setGenres] = useState([]);
  const [checkedGenres, setCheckedGenres] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [newMovie, setNewMovie] = useState({
    title: "",
    status: "publish",
    recension: "",
    rating: "",
  });

  let history = useHistory();

  useEffect(() => {
    getGenresApi();
  }, []);

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

  function postNewMovie(token) {
    let item = {
      title: newMovie.title,
      status: "publish",
      genres: checkedGenres,
      fields: {
        genrecustom: checkedGenres,
        recension: newMovie.recension,
        rating: newMovie.rating,
      },
    };

    axios
      .post("http://localhost:8888/aewordpress/wp-json/wp/v2/movies/", item, {
        headers: { Authorization: "Bearer" + token },
      })
      .then((resp) => {
        console.log(resp.data);
        if (resp.status === 201) {
          setIsAdded(true);
        }
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

  function handleChange(e) {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  }

  function onClickAddMovie(e) {
    e.preventDefault();
    if (checkedGenres.length > 0) {
      if (newMovie.title.trim() === "" || newMovie.recension.trim() === "") {
        return setErrorMsg("emptyInput");
      }

      postNewMovie(token);
    } else {
      setErrorMsg("checkbox");
    }
  }

  function redirect() {
    history.push("/");
  }

  return (
    <main className="AddDiv">
      {isAdded && <Redirect to="/" />}

      <div className="divHeader">
        <h1>Lägg till film</h1>
        <button onClick={redirect}>Se alla filmer</button>
      </div>
      <Form
        genres={genres}
        newMovie={newMovie}
        handleSubmit={onClickAddMovie}
        submitButtonText="Lägg till"
        handleChange={handleChange}
        onChangeGenre={onChangeGenre}
        errorMsg={errorMsg}
      />
    </main>
  );
}

export default Add;


/*   <select onChange={onChangeGenre}>
          <option value="Välj genre" disabled selected>
            Välj genre
          </option>
          {genres.map((genre) => {
            return (
              <option key={genre.id} value={genre.title.rendered}>
                {genre.title.rendered}
              </option>
            );
          })}
        </select> */

{
  /* <form>
        <label name="title">Filmtitel</label>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={newMovie.title}
        />
        <label name="recension">Recension</label>
        <textarea
          name="recension"
          onChange={handleChange}
          value={newMovie.recension}
        />
        <label name="rating">Rating</label>
        <input
          type="number"
          name="rating"
          onChange={handleChange}
          value={newMovie.rating}
        />
        <br />
        <label name="genre">
          <strong>Genre</strong>
          {genres.map((genre) => {
            return (
              <label key={genre.id}>
                {genre.name}
                <input
                  type="checkbox"
                  value={genre.name}
                  onChange={onChangeGenre}
                  name="genre"
                  id={genre.id}
                />
              </label>
            );
          })}
        </label>
        <input type="submit" value="Färdig" onClick={onClickSubmit} />
      </form> */
}
