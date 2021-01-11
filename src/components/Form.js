import react, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

function Form({
  genres,
  newMovie,
  handleChange,
  handleSubmit,
  onChangeGenre,
  submitButtonText,
  result,
  errorMsg,
}) {
  let element;

  if (newMovie.genres) {
    //mappar igenom ALLA genres
    let mappedGenreId = genres.map((genre) => {
      return genre.id;
    });
    console.log("ALLA genres id:", mappedGenreId);

    //hittar de VALDA genres i ALLA genres
    const intersection = newMovie.genres.filter((element) =>
      mappedGenreId.includes(element)
    );
    console.log("VALDA genres array:", intersection);

    //loopar igenom VALDA genres
    intersection.forEach((element) => {
      console.log("VALDA genre var för sig:", element);

      return element;
    });
  }

  return (
    <FormWrapper>
      <form>
        <label className="inputs title" name="title">
          Filmtitel
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={newMovie.title}
            required
            autoFocus
          />
        </label>
        <label className="inputs recension" name="recension">
          Recension
          <textarea
            name="recension"
            onChange={handleChange}
            value={newMovie.recension}
            required
          />
        </label>
        <label className="inputs rating" name="rating">
          Rating
          <input
            type="range"
            name="rating"
            min="0"
            max="5"
            onChange={handleChange}
            value={newMovie.rating ? newMovie.rating : (newMovie.rating = "0")}
            required
          />
          {newMovie.rating ? newMovie.rating : <span>0</span>}
          <span>/5</span>
        </label>
        <br />
        <label className="genre" name="genre">
          <p>Välj en eller fler genres</p>
          <br />
          {genres.map((genre) => {
            console.log("element i checkbox", element)
            return (
              <label key={genre.id}>
                {genre.name}
                <input
                  type="checkbox"
                  value={genre.name}
                  onChange={onChangeGenre}
                  name="genre"
                  id={genre.id}
                  //checked={genre.id === element} // element är undefined här
                />
                <br />
              </label>
            );
          })}
        </label>
        <div className="submitBtnDiv">
          <input
            className="submitBtn"
            type="submit"
            value={submitButtonText}
            onClick={handleSubmit}
          />
        </div>
      </form>
      {errorMsg === "checkbox" && <p className="error">Välj minst en genre</p>}
      {errorMsg === "emptyInput" && (
        <p className="error">Input kan inte vara tomt</p>
      )}
    </FormWrapper>
  );
}

export default Form;

const FormWrapper = styled.div`
  width: 80%;
  height: auto;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .error {
    color: red;
  }

  form {
    width: 50%;
    display: flex;
    flex-direction: column;
  }
  .inputs {
    margin: 7px 0 0 0;
  }
  .title {
    input {
      width: 100%;
      height: 20px;
      border: none;
      border-bottom: 2px solid #a3c3d8;
      background-color: #e3eef5;
      outline: none;
      margin-top: 5px;
      font-family: "Roboto", sans-serif;
    }
  }
  .recension {
    textarea {
      width: 100%;
      height: 70px;
      border: none;
      border-bottom: 2px solid #a3c3d8;
      background-color: #e3eef5;
      outline: none;
      margin-top: 5px;
      font-family: "Roboto", sans-serif;
    }
  }
  .genre {
    margin-bottom: 5px;
    p {
      margin: 5px 0 -10px 0;
    }
  }
  .submitBtnDiv {
    display: flex;
    justify-content: center;
  }
  .submitBtn {
    width: 116px;
    height: 49px;
    box-shadow: 0px 10px 10px -7px #80a4c0;
    background-color: #d0e2eb;
    border-radius: 15px;
    border: 2px solid #a3c3d8;
    display: inline-block;
    cursor: pointer;
    color: #456289;
    font-size: 16px;
    padding: 6px 12px;
    text-decoration: none;

    :hover {
      background-color: #80a4c0;
      color: #d0e2eb;
    }
  }
`;
