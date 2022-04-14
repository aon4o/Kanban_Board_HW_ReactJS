

const Title = (props) => {
    document.title = props.children;

    return (
        <>
            <h1 className={'mb-5'}>{props.children}</h1>
        </>
    )
}

export default Title;