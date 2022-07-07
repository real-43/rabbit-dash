import Select from 'react-select';

const Selects = (props) => {
    const style = {
        control: styles => ({ ...styles, backgroundColor: 'white', borderRadius: '.5rem',fontWeight: 500, paddingLeft: '10px', fontSize: '17.5px', height:'40px' }),
        option: (styles, { isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isSelected ? '#9FD3FF' : isFocused ? '#EAF8FF' : null,
                fontWeight: 500,
                fontSize: '17.5px',
                paddingLeft: '17px'
            };
        },
        placeholder: styles => ({ ...styles, fontWeight: 500, fontSize: '17.5px' })
    };
    return (
        // isClearable={true}
        <Select onChange={(e) => props.func_setSelect(e, props.setState)} styles={style} placeholder={props.placeholder} options={props.options} defaultValue={props.options[0]}/>
    )
}
export default Selects