import { Formik, Form, Field,
  // ErrorMessage
  } from 'formik';

export default function ServerConfigForm({dispatch, ventilator_session}) {

const initialValues=ventilator_session

return <Formik
        initialValues={initialValues}
      onSubmit={async (values) => {
        dispatch({type: 'patch', value: {ventilator_session: values}})
        //await new Promise((r) => setTimeout(r, 500));
        //alert(JSON.stringify(values, null, 2));
      }}
    >
    <Form>

    <label htmlFor="dserverurl">Server URL:</label>
    <Field type="url" id="dserverurl" name="dserverurl" />

    <label htmlFor="traceid">Trace ID:</label>
    <Field type="text" id="traceid" name="traceid" />

    <label htmlFor="samples_to_plot">
        Number of Samples (~10s per 15000 samples):
    </label>
    <Field type="text" id="samples_to_plot" name="samples_to_plot" />

    <button type="submit">Update</button>
  </Form>
</Formik>
}
