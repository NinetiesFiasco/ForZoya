import {connect} from 'react-redux';
import ExampleRedactor from './ExampleRedactor';

class Example extends React.Component{

  // AJAX запросы
  query(pars){
    var ajaxes = {
      method: pars.method,
      url: window.BackEndURL + pars.url,
      headers:{
        "Authorization": localStorage.getItem("Token")
      },
      contentType: "application/json; charset=utf-8", // Мы пошлём серверу JSON
      dataType: "json", // Мы ждём от сервера JSON
      success: pars.success,
      error: pars.error
    };
    if (pars.data !== undefined)
      ajaxes.data = pars.data;

    $.ajax(ajaxes);
  }

  // Конструктор 
  // Даёт доступ к пропсам элемента
  // Создаёт пустой объект example
  // Задаёт начальное состояние
  // Привязывает this к методам
  constructor(props){
    super(props);

    this.emptyElement = {
      id: "",guid: "",dateadd: "",fio: "",age: "",man: "",_id: ""
    }

    this.state = {
      data: null,
      error: null,
    };

    this.read = this.read.bind(this);
    this.readAnswer = this.readAnswer.bind(this);

    this._delete = this._delete.bind(this);
    this.deleteAnswer = this.deleteAnswer.bind(this);

    this.displayInRedactor = this.displayInRedactor.bind(this);
  }

  // При инициализии объекта идёт запрос за объектами
  componentDidMount(){
    this.read();
  }  

  // ***** AJAX запросы и обработчики *****

  // Запрос за объектами
  read(){
    this.query({
      method: "GET",
      url:"example/read",
      success: this.readAnswer,
      error: null
    });
  }
  // Отобразить прочитанные объекты
  readAnswer(answer){
    if (answer.success === 0)
      this.setState({
        error: answer.message,
        data: null,
      });
    else if (answer.success === 1){
      this.setState({
        data: answer.data,
        error: null
      });
    }
  }

  // Удалить объект
  _delete(xKey){
    this.query({
      method: "DELETE",
      url: "example/delete/"+this.state.data[xKey]._id,
      success: this.deleteAnswer
    });
  }
  // После удаления объекта перезагрузить все
  deleteAnswer(answer){
    if (answer.success === 0)
      this.setState({
        error: answer.message,
        data: null,
      });
    else if (answer.success === 1){
      this.read();
    }
  }

  // ***** ***** ***** ***** ***** 
  
  // Показать нужный объект в редакторе
  displayInRedactor(obj){
    this.props.setElement(obj);
  }
  
  // Главный рендер
  // Заголовок, кнопка новый объект, таблица объектов и редактор объектов
  render(){     
    return <div>
        <div>Example</div>
        <div>
          <button onClick={()=>{this.displayInRedactor(this.emptyElement)}}>Добавить</button> новый example
        </div>
        {this.renderData()}   
        {this.renderRedactor()}     
        
      </div>;
  }
  // Рендер таблицы объектов
  renderData(){
    if (!this.state.data && this.state.error){
      return <div>Ошибка {this.state.error}</div>
    }else if (!this.state.data && !this.state.error){
      return <div>Элементов нет</div>
    } else {
      return <table>
        <thead>
          <tr><th>_id</th><th>id</th><th>guid</th><th>dateadd</th><th>fio</th><th>age</th><th>man</th><th>xKey</th><th colSpan='2'>Действия</th></tr>
        </thead>
        <tbody>
        {this.state.data.map((ex,xKey)=>{
          return <tr key={xKey}>
            <td>{ex._id}</td><td>{ex.id}</td><td>{ex.guid}</td><td>{ex.dateadd}</td><td>{ex.fio}</td><td>{ex.age}</td><td>{ex.man}</td><td>{xKey}</td>
            <td><input type='button' value='Редактировать' onClick={()=>{this.displayInRedactor(this.state.data[xKey])}} /></td>
            <td><input type='button' value='Удалить' onClick={()=>{this._delete(xKey)}} /></td>
          </tr>
        })}
        </tbody>
        <tfoot></tfoot>
      </table>
    }
  }
  renderRedactor(){
    if (this.props.example.element != null){      
      return <ExampleRedactor Element={this.props.example.element} AfterChange={this.read} />
    }
  }
}

export default connect(
  state => ({
    example: state.example
  }),
  dispatch => ({
    setElement: (element) =>{
      dispatch({type: 'SET_ELEMENT', payload: element})
    }
  })
)(Example); 