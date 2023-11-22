import './App.css';
import React, { useEffect, useState } from "react"

function App() {
    // елемента альбома
    const [elementsAlbums, setElementsAlbum] = useState([])
    // выбранный номер альбом 
    const [numberAlbum, setNumberAlbum] = useState(1)
    // элементы альбома на экране
    const [elementsRender, setElementsRender] = useState([])
    // в инпуте поиска
    const [textInput, setTextInput] = useState("")
    // выбранный элемент для модельного окна
    const [selectItem, setSelectItem] = useState([])
    //индекс выбранного элемента 
    const [selectItemIndex, setSelectItemIndex] = useState({})
    // текст инпута добавления коментария
    const [textComment, setTextComment] = useState(null)
    useEffect(()=>{
        fetch(`https://jsonplaceholder.typicode.com/albums/${numberAlbum}/photos`)
            .then((response) => response.json())
            .then((json) => {

                json.forEach(function(el) {
                    el.comment = []
                })

                setElementsAlbum(json);
                setElementsRender(json)
            });
    },[]);
    
    function SelectAlbum () {
        setNumberAlbum(document.getElementById("AlbumSelect").value)
        fetch(`https://jsonplaceholder.typicode.com/albums/${document.getElementById("AlbumSelect").value}/photos`)
            .then((response) => response.json())
            .then((json) => {
                json.forEach(function(el) {
                    el.comment = []
                })
                setElementsAlbum(json);
                setElementsRender(json)
            });
    }

    function SortAlbum () {
        switch (+document.getElementById("sortSelect").value) {
            case 1:
                elementsRender.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
                setElementsRender([...elementsRender])
                break;
            case 2:
                elementsRender.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)).reverse()  
                setElementsRender([...elementsRender])
                break;
            case 3:
                elementsRender.sort((a,b) => (a.comment.length > b.comment.length) ? -1 : ((b.comment.length > a.comment.length) ? 1 : 0)) 
                setElementsRender([...elementsRender])
                break;
            default:
                break;
        }
    }
    
    function ChangeInput (e){
        setTextInput(e.target.value)
    }
    function SearchInAlbum () {
        let searchElementAlbums = elementsAlbums.filter(item => item.title.includes(textInput))
        setElementsRender([...searchElementAlbums])
    }

    function openModal (element,index) {
        setSelectItemIndex(index)
        setSelectItem(elementsRender[index])
        document.getElementById("modal").style.visibility = "visible"
        document.getElementById("modal2").style.visibility = "visible"
        document.getElementsByTagName("body")[0].style.overflow = "hidden"
    }
    function closeModal () {
        document.getElementById("modal").style.visibility = "hidden"
        document.getElementById("modal2").style.visibility = "hidden"
        document.getElementsByTagName("body")[0].style.overflow = "visible"
    }
    function ChangingSlide (a){
            if(a === "+" && +selectItemIndex < elementsRender.length -1){
                setSelectItemIndex(+selectItemIndex + 1)
                setSelectItem(elementsRender[selectItemIndex + 1])
            }
            if(a ==="-" && +selectItemIndex > 0 ){
                setSelectItemIndex(+selectItemIndex - 1)
                setSelectItem(elementsRender[selectItemIndex - 1])
            }
    }

    function TextInputComment (e){
        setTextComment(e.target.value)
    }
    function addComment () {
        elementsAlbums[selectItem.id - 1].comment = [...elementsAlbums[selectItem.id - 1].comment,textComment]
        setElementsAlbum([...elementsAlbums])
        document.getElementById("inputComment").value = ""
    }
    console.log(selectItem)
    return (
        <>
        <div id="modal" className='modalBackground'>
            <div 
            id="modal2"
             className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <img src={selectItem.url} alt="images" className='images'/>
                    <p>{selectItem.title}</p>  
                </div>
                <div className='nav'>
                    <button onClick={()=>ChangingSlide("-")}>назад</button>
                    <button onClick={()=>ChangingSlide("+")}>вперед</button>
                </div>
                <div className='comment'>
                    <input id="inputComment" onChange={TextInputComment}/>
                    <button onClick={addComment}>добавить комментарий</button>
                    <div className='commentText' >
                        <h5>коментарий</h5>
                        {1 && 
                            <div>
                                {selectItem.comment?.map((elem,index) => {
                                    return (
                                        <div key = {index} value={index + 1}>
                                            {'Коментарий № ' + (+index + 1) + `: ${elem}`}
                                        </div>
                                    )
                                })}
                            </div> 
                        }
                    </div>
                </div>
                
            </div>
        </div>

        <div className="gallery">
            <div className="header">
                <h1>
                    Галерея альбома №{numberAlbum}
                </h1>
                <label htmlFor="selectSortSearch">Настройки поиска</label>
                <div className='selectSortSearch' id='selectSortSearch'>
                    <div className="selectionAlbum">
                        <select name="Album" id="AlbumSelect">
                            {
                                [...Array(100)].map((elem,index) => {
                                    return (
                                        <option key = {index} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    )
                                })
                            } 
                        </select>
                        <button onClick={SelectAlbum}>
                            выбрать альбом
                        </button>
                    </div>  

                    <div className="sort">
                        <select name="sort" id="sortSelect">
                            <option  value={1}>
                                A-Z
                            </option>
                            <option  value={2}>
                                Z-A
                            </option>
                            <option  value={3}>
                                comments {">"} 1
                            </option>
                        </select>
                        <button onClick={SortAlbum}>
                            сортировать
                        </button>
                    </div>
                        
                    <div className="search">
                        <input className='inputSearch' onChange={ChangeInput}/>
                        <button onClick={SearchInAlbum}>
                            найти
                        </button>
                    </div>
                </div>
            </div>
            <div className="allImages">    
                {
                    elementsRender.map((element,index)=>{
                        return (
                            <div className="post" key={index} id={element.id} onClick={() => openModal(element,index)}>
                                <img src={element.url} alt="images" className='images'/>
                                <p>{element.title}</p>
                                <p>Коментариев: {element.comment.length}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        </>
    );
}

export default App;
