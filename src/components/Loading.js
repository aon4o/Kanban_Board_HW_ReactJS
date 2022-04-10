import {Alert, Spinner} from "react-bootstrap";


const Loading = (props) => {

    return (
        <>
            {
                props.loading ?
                    <Spinner animation="border" variant={'primary'} />
                    :
                    <Alert variant={'info'} className={'text-center'}>
                        <Alert.Heading className={'mb-0'}>
                            {
                                props.message ?
                                    <>
                                        {props.message}
                                    </>
                                    :
                                    <>
                                        ERROR
                                    </>
                            }
                        </Alert.Heading>
                    </Alert>
            }
        </>
    )
}

export default Loading;