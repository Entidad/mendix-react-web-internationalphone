import{Component}from"react";
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
	// Guarded action execution, shared by the widget-level and per-attribute actions.
	executeAction(action){
		if(!action)return;
		if(
			action.canExecute&&
			action.isAuthorized&&
			!(action.isExecuting&&action.disabledDuringExecution)
		){
			action.execute();
		}
	}
	// Write the formatted number into every configured attribute. Kept separate from
	// firing the per-row actions because the legacy widget refreshed these attributes on
	// country change but only ran the microflows on blur.
	writePhoneNumberAttributes(getFormattedNumber){
		const items=this.props.phoneNumberAttributes;
		if(!items||!items.length||typeof getFormattedNumber!=="function")return;
		items.forEach((item)=>{
			const attribute=item.phoneNumberAttribute;
			if(attribute&&attribute.status=="available"&&!attribute.readOnly){
				attribute.setValue(getFormattedNumber(item.phoneNumberAttributeFormat));
			}
		});
	}
	// Run every row's action. Called only after all attributes are written, so a
	// microflow sees the complete set of values.
	firePhoneNumberActions(){
		const items=this.props.phoneNumberAttributes;
		if(!items||!items.length)return;
		items.forEach((item)=>this.executeAction(item.onChange));
	}
	onChange(value,getFormattedNumber,iso2){
		// The dropped text box owns its own value binding and On change event, so we only
		// deal with the formatted-number and country attributes here. Order matches the
		// legacy widget: numbers, then country, then the per-row actions -- so a microflow
		// sees every value already committed.
		this.writePhoneNumberAttributes(getFormattedNumber);
		this.writeCountry(iso2);
		this.firePhoneNumberActions();
	}
	// Single guarded writer for the country attribute, used by both the countrychange
	// event and the blur handler.
	writeCountry(iso2){
		if(!iso2)return;
		const attribute=this.props.initialCountryAttribute;
		if(attribute&&attribute.status=="available"&&!attribute.readOnly){
			attribute.setValue(iso2);
		}
	}
	setIso2(value,getFormattedNumber){
		this.writeCountry(value);
		// The dial code just changed, so the formatted number did too. Legacy refreshed the
		// attributes here but deliberately did not run the per-row microflows.
		this.writePhoneNumberAttributes(getFormattedNumber);
	}
	render(){
		const allowDropdown=this.props.allowDropdown||null;
		const autoHideDialCode=this.props.autoHideDialCode||null;
		const autoPlaceholder=this.props.autoPlaceholder||"";
		const excludeCountries=this.props.excludeCountries||[];
		const formatOnDisplay=this.props.formatOnDisplay||null;
		// A non-list enumeration prop is the key string itself, not an EditableValue --
		// reading .value here always yielded undefined, so this setting never applied.
		const initialCountry=this.props.initialCountry||"";
		const initialCountryAttribute=this.props.initialCountryAttribute.value||"";
		const localizedCountries=this.props.localizedCountries||[];
		const nationalMode=this.props.nationalMode||null;
		const onlyCountries=this.props.onlyCountries||[];
		const placeholderNumberTypeAttribute=this.props.placeholderNumberTypeAttribute;
		const placeholderNumberType=(
			placeholderNumberTypeAttribute&&
			placeholderNumberTypeAttribute.status=="available"&&
			placeholderNumberTypeAttribute.value
		)||this.props.placeholderNumberType||"";
		const preferredCountries=this.props.preferredCountries||[];
		const separateDialCode=this.props.separateDialCode||null;
		//--------------------------------------------------------------------------------
		return(
			<InternationalPhoneComponent
				onChange={(value,getFormattedNumber,iso2)=>{this.onChange(value,getFormattedNumber,iso2);}}
				setIso2={(value,getFormattedNumber)=>{this.setIso2(value,getFormattedNumber);}}
				content={this.props.content}
				allowDropdown={allowDropdown}
				autoHideDialCode={autoHideDialCode}
				autoPlaceholder={autoPlaceholder}
				excludeCountries={excludeCountries}
				formatOnDisplay={formatOnDisplay}
				/* The attribute overrides the enum, per the property description, but only
				   when it actually holds a value -- otherwise fall back to the enum. */
				initialCountry={initialCountryAttribute||initialCountry}
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
