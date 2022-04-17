

const Title = (props) => {
    document.title = props.children;

    return (
        <>
            <h1 className={'mb-5 fw-bolder'}>{props.children}</h1>
        </>
    )
}

export default Title;