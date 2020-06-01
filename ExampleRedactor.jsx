import {connect} from 'react-redux';

class ExampleRedactor extends React.Component{


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

    this.state = {
      error: null,
      element: this.props.Element
    };
    this.fields = ['id','guid','dateadd','fio','age','man'];
    for (var i=0;i<this.fields.length;i++)
      this['tb'+this.fields[i]] = React.createRef();

    this.merge = this.merge.bind(this);
    this.hideRedactor = this.hideRedactor.bind(this);
    this.updatedAnswer = this.updatedAnswer.bind(this);
    this.redactorRow = this.redactorRow.bind(this);

  }


  // ***** AJAX запросы *****

  // Merge создать или обновить объект в зависимости от наличия _id (идентификатора MongoDB)
  merge(){
    var postData = this.state.element,

    queryPars = {
      success: this.updatedAnswer,
      error: null,
      data: JSON.stringify(postData)
    };
    
    if (this.props.example.element._id == ""){
      queryPars.url = "example/create";
      queryPars.method = "POST";
      delete postData._id;
    } else {
      queryPars.url = "example/update/"+this.props.example.element._id;
      queryPars.method = "PUT";
    }
    
    this.query(queryPars);
    
    this.hideRedactor();
  }

  // ***** ***** ***** ***** ***** 

  // ***** Обработчики AJAX ответов *****

  // После обновления объекта перезагрузить все
  updatedAnswer(answer){
    if (answer.success === 0)
      this.setState({
        error: answer.message
      });
    else if (answer.success === 1){
      this.props.setElement(null);
      this.props.AfterChange();
    }
  }

  // ***** ***** ***** ***** *****

  // Спрятать редактор
  hideRedactor(){
    this.props.setElement(null);
  }  
  
  // Рендер формы редактирования
  render(){
    if (this.props.Element == null)
      return <div>В редакторе не установлен элемент</div>;    

    return (
<div style={{display: this.props.example.element!=null ? 'block' : 'none'}}>
  <div>Redactor</div>
  <table key={this.props.example.element._id}>
    <thead>
      <tr><th>Поле</th><th>Значение</th></tr>
    </thead>
    <tbody>
      {this.fields.map((field,xKey)=>{
        return this.redactorRow(field,xKey);
      })}
    </tbody>
    <tfoot>
      <tr>
        <td><button onClick={()=>{this.hideRedactor()}}>Отменить</button></td>
        <td><button onClick={this.merge}>{this.props.example.element._id==""?'Добавить':'Обновить'}</button></td>
      </tr>
    </tfoot>
  </table>
</div>)
  }
    
  redactorRow(field,xKey){
    return (
<tr key={xKey}>
  <td>{field}</td>
  <td>
    <input 
      type='text' 
      ref={this['tb'+field]} 
      defaultValue={this.props.example.element[field]} 
      placeholder={field} 
      onChange={()=>{this.hndFieldChange(event,field)}} 
    />
  </td>
</tr>)
  }

  // Обработчик изменения поля
  hndFieldChange(event,field){
    var obj = {
      element: JSON.parse(JSON.stringify(this.state.element))
    };

    obj.element[field]=event.target.value;
    this.setState(obj);
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
)(ExampleRedactor); 