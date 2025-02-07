import axios from 'axios'

const api = axios.create({
     baseURL: "http://localhost:5247/"    //hhtp conn
     //baseURL: "https://localhost:7171/"   //https conn
})

export default api;

//Se necessário, troque a BaseURL para visualizar corretamente os retornos