export const onSnapshot = (ref, callback, options) => {
    ref.onSnapshot((snapshot)=> {
        let items = snapshot.docs.map((doc)=>{
            const data=doc.data();
            data.id=doc.id;
            return data;
        });
        items = (options && options.sort)?items.sort(options.sort):items;
        callback(items);
    });
};

export const addDoc = (ref, {id, ...data}) => {
    const doc = id? ref.doc(id):ref.doc();
    doc.set(data);
}

export const removeDoc = (ref, id) => {
    ref.doc(id).delete();
}

export const updateDoc = (ref, id, data) => {
    ref.doc(id).set(data);
}