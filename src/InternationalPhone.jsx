import{Component,createElement}from"react";
import{InternationalPhoneComponent}from"./components/InternationalPhoneComponent";
import"./ui/InternationalPhone.css";
export default class InternationalPhone extends Component{
	constructor(props){
		super(props);
		window.wmain=this;
	}
	componentDidMount(){
	}
	componentWillUnmount(){
	}
	componentDidUpdate(prvprops,prvstate){
	}
	onChange(value){
		if(this.props.value&&this.props.value.status=="available")this.props.value.setValue(value);
		if(
			this.props.onChangeAction
		){
			if(
				this.props.onChangeAction.canExecute&&
				this.props.onChangeAction.isAuthorized&&
				!(
					this.props.onChangeAction.isExecuting&&
					this.props.onChangeAction.disabledDuringExecution
				)
			){
				this.props.onChangeAction.execute();
			}
		}
	}
	setIso2(value){
		const initialCountryAttribute=this.props.initialCountryAttribute.value||"";
		if(this.props.initialCountryAttribute&&this.props.initialCountryAttribute.status=="available")this.props.initialCountryAttribute.setValue(value);
		if(
			this.props.onChangeAction
		){
			if(
				this.props.onChangeAction.canExecute&&
				this.props.onChangeAction.isAuthorized&&
				!(
					this.props.onChangeAction.isExecuting&&
					this.props.onChangeAction.disabledDuringExecution
				)
			){
				this.props.onChangeAction.execute();
			}
		}
	}
	render(){
		//--------------------------------------------------------------------------------
		const value=this.props.value.value||"";
		const validation=this.props.value.validation;
		//--------------------------------------------------------------------------------
		const allowDropdown=this.props.allowDropdown||null;
		const autoHideDialCode=this.props.autoHideDialCode||null;
		const autoPlaceholder=this.props.autoPlaceholder||"";
		const excludeCountries=this.props.excludeCountries||[];
		const formatOnDisplay=this.props.formatOnDisplay||null;
		const initialCountry=this.props.initialCountry.value||"";
		const initialCountryAttribute=this.props.initialCountryAttribute.value||"";
		const localizedCountries=this.props.localizedCountries||[];
		const nationalMode=this.props.nationalMode||null;
		const onlyCountries=this.props.onlyCountries||[];
		const placeholderNumberType=this.props.placeholderNumberType||"";
		const preferredCountries=this.props.preferredCountries||[];
		const separateDialCode=this.props.separateDialCode||null;
		//--------------------------------------------------------------------------------
		return(
			<InternationalPhoneComponent
				onChange={(value)=>{this.onChange(value);}}
				setIso2={(value)=>{this.setIso2(value);}}
				value={value}
				validation={validation}
				allowDropdown={allowDropdown}
				autoHideDialCode={autoHideDialCode}
				autoPlaceholder={autoPlaceholder}
				excludeCountries={excludeCountries}
				formatOnDisplay={formatOnDisplay}
				initialCountry={initialCountryAttribute}
				localizedCountries={localizedCountries}
				nationalMode={nationalMode}
				onlyCountries={onlyCountries}
				placeholderNumberType={placeholderNumberType}
				preferredCountries={preferredCountries}
				separateDialCode={separateDialCode}
			/>
		);
	}
}
