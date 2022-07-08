import Select from 'react-select';

const Selects = (props) => {
    const style = {
        control: styles => ({ ...styles, backgroundColor: 'white', borderRadius: '4px',fontWeight: 500, fontSize: '17.5px', height:'38px', marginLeft: "-10px" }),
        option: (styles, { isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isSelected ? '#9FD3FF' : isFocused ? '#EAF8FF' : null,
                fontWeight: 500,
                fontSize: '17.5px',
            };
        },
        placeholder: styles => ({ ...styles, fontWeight: 500, fontSize: '17.5px' })
    };
    return (
        // isClearable={true}
        <Select onChange={(e) => props.func_setSelect(e, props.setState)} styles={style} placeholder={props.placeholder} isClearable={true} options={props.options} />
    )
}
export default Selects