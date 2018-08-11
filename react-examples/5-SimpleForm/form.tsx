import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {holdState, holdAllProps, Holders, TextBox, TextArea, Label, LabelSpan,
        CheckBox, Radio, Button, Slider, TimeBox, DateBox} from './controls';

// Note: if wrapInHolders(model) is called without extra arguments,
//       unspecified values must be explicitly set to undefined so
//       the function knows they exist.
class Model {
  name: string = "";
  age?: number = undefined;
  address: string = "";
  city: string = "";
  province: string = "";
  country: string = "";
  date?: Date = undefined;
  color: string = "#bbff44";
  virgin: boolean = false;
}

// A simple form component with react-holders
function MyForm(p: Holders<Model> & { children: React.ReactNode }) {
  return <form>
    <TextBox p label="Name:"     value={p.name} autoComplete="name"/>
    <TextBox p label="Age:"      value={p.age}  type="number"
             parse={s => parseFloat(s) || new Error("Invalid age")}/>
    <TextBox p label="Address:"  value={p.country}  autoComplete="address-line1"/>
    <TextBox p label="City:"     value={p.city}     autoComplete="address-level1"/>
    <TextBox p label="Province:" value={p.province} autoComplete="address-level1"/>
    <TextBox p label="Country:"  value={p.country}/>
    <TextBox p label="Color:"    value={p.color} type="color"/>
    <CheckBox p label="Virgin"   value={p.virgin}/>
    {p.children}
  </form>;
}

interface FormState {
  checkbox1: boolean;
  checkbox2: boolean;
  fruit: "apple"|"banana"|"cherry"|undefined;
  happiness: number;
  code: string;
  date?: Date;
}

class StatefulForm extends React.Component<{}, FormState>
{
  constructor(props: {}) {
    super(props);
    this.state = {
      checkbox1: false,
      checkbox2: true,
      fruit: undefined,
      happiness: 1,
      date: undefined,
      code: '.class Foo extends Base {\n  prefix := ""\n  .constructor(@public bar: int) {}\n  .fn toString() => prefix + bar.toString()\n}'
    };
  }
  render() {
    var hs = holdState(this as StatefulForm), date = hs('date');
    return (
      <form><fieldset>
        <legend>Additional input fields:</legend>
        <CheckBox p value={hs('checkbox1')} label="I am prepared to see various form elements"/>
        { !this.state.checkbox1 ? [] : [
          <Label p label="Date/time (UTC):">
            <DateBox value={date} utc={true}/>
            <TimeBox value={date} utc={true}/>
          </Label>,
          <Label p label="Date/time (local):">
            <DateBox value={date}/>
            <TimeBox value={date}/>
          </Label>,
          <CheckBox p value={hs('checkbox2')} label="Checkbox:" labelAfter={false} />,
          <Label p label="Happiness level:">
            <Slider value={hs('happiness')} min={-10} max={10} step={1}
                    list="ticks" style={ {width:"12em"} }/>
            <TextBox type="number" value={hs('happiness')} style={ {width:"4em"} }
                     parse={s => parseInt(s)}/>
            <datalist id="ticks">
              <option value="-10"/><option value="-5"/>
              <option value="0"/>
              <option value="5"/><option value="10"/>
            </datalist>
          </Label>,
          <Label p label="Select fruit:">
            <Radio value={hs('fruit')} is="apple"  label="Apple "/>
            <Radio value={hs('fruit')} is="banana" label="Banana "/>
            <Radio value={hs('fruit')} is="cherry" label="Cherry "/>
          </Label>,
          <p><LabelSpan/>
            <Button onClick={() => alert(`Your ${this.state.fruit} is coming.`)}>
              Deliver fruit
            </Button>
          </p>,
          <p><a href="http://loyc.net/les">LES</a> <a href="http://loyc.net/2017/lesv3-update.html">v3</a> code<br/>
            <TextArea value={hs('code')} cols={50} rows={5}/>
          </p>
        ]}
      </fieldset></form>);
  }
}

class App extends React.Component<{model:Model}, Holders<Model>>
{
  constructor(props: {model:Model}) {
    super(props);
    this.state = holdAllProps(props.model, 
      (propName, newVal) => {
        this.setState({});
        return true;
      });
  }
  render() {
    return (
      <div>
        <h3>Personal Information Form</h3>
        <MyForm {...this.state}>
          <textarea value={JSON.stringify(this.props,null," ")} style={ {width:"100%"} } rows={10} readOnly/>
        </MyForm>
        <br/>
        <StatefulForm/>
      </div>);
  }
}

ReactDOM.render(<App model={new Model()}/>, document.getElementById('app'));
